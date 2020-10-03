<?php
namespace SVB\CBS\ShippingWorldBundle\Model;
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 23.09.15
 * Time: 16:14
 */
interface BookInterface
{

    /**
     * @return string
     */
    public function getTitle();

    /**
     * @return BookInterface[]
     * (0..2)
     */
    public function getPreviousVersions();

    /**
     * @return string
     */
    public function getContent();

    /**
     * @return int
     */
    public function getCountReaders();


}