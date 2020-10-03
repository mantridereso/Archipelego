<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 23.09.15
 * Time: 16:42
 */

namespace SVB\CBS\ShippingWorldBundle\Model;


interface LibrarianInterface extends ActorInterface
{

    /**
     * @return VillageInterface
     */
    public function getVillage();

}